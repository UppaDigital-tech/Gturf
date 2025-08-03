from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from subscriptions.models import SubscriptionTier
from games.models import Game
from accounts.models import User

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate sample data for Galactiturf platform'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create subscription tiers
        self.create_subscription_tiers()
        
        # Create sample games
        self.create_sample_games()
        
        # Create sample users
        self.create_sample_users()

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )

    def create_subscription_tiers(self):
        """Create subscription tiers."""
        tiers_data = [
            {
                'name': 'bronze',
                'price': 5000.00,
                'coins_awarded': 1000,
                'description': 'Perfect for casual players. Get 1000 coins to start booking games.',
                'duration_days': 30
            },
            {
                'name': 'silver',
                'price': 15000.00,
                'coins_awarded': 5000,
                'description': 'Great value for regular players. Get 5000 coins for more gaming opportunities.',
                'duration_days': 30
            },
            {
                'name': 'gold',
                'price': 25000.00,
                'coins_awarded': 10000,
                'description': 'Premium package for serious players. Get 10000 coins for unlimited gaming.',
                'duration_days': 30
            }
        ]

        for tier_data in tiers_data:
            tier, created = SubscriptionTier.objects.get_or_create(
                name=tier_data['name'],
                defaults=tier_data
            )
            if created:
                self.stdout.write(f'Created subscription tier: {tier.name}')
            else:
                self.stdout.write(f'Subscription tier already exists: {tier.name}')

    def create_sample_games(self):
        """Create sample football games."""
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            self.stdout.write('No admin user found. Creating games with default user.')
            admin_user = User.objects.first()

        games_data = [
            {
                'name': 'Weekend Warriors',
                'location': 'Lagos Sports Complex, Victoria Island',
                'date_time': timezone.now() + timedelta(days=2, hours=14),
                'coin_price': 500,
                'total_slots': 22,
                'description': 'Casual weekend football game for all skill levels. Great atmosphere and friendly competition.'
            },
            {
                'name': 'Elite League Match',
                'location': 'National Stadium, Surulere',
                'date_time': timezone.now() + timedelta(days=3, hours=16),
                'coin_price': 800,
                'total_slots': 22,
                'description': 'Competitive match for experienced players. High-intensity game with professional referees.'
            },
            {
                'name': 'Youth Development',
                'location': 'Ikoyi Football Academy',
                'date_time': timezone.now() + timedelta(days=4, hours=10),
                'coin_price': 300,
                'total_slots': 20,
                'description': 'Training session focused on skill development. Suitable for players aged 16-25.'
            },
            {
                'name': 'Corporate League',
                'location': 'Eko Hotel Sports Center',
                'date_time': timezone.now() + timedelta(days=5, hours=18),
                'coin_price': 600,
                'total_slots': 24,
                'description': 'Corporate networking through football. Mix of business and sports in a professional setting.'
            },
            {
                'name': 'Women\'s Football Night',
                'location': 'Lekki Sports Complex',
                'date_time': timezone.now() + timedelta(days=6, hours=19),
                'coin_price': 400,
                'total_slots': 18,
                'description': 'Exclusive women\'s football session. Empowering women through sports and fitness.'
            },
            {
                'name': 'Golden Age Football',
                'location': 'Ajah Community Center',
                'date_time': timezone.now() + timedelta(days=7, hours=15),
                'coin_price': 250,
                'total_slots': 16,
                'description': 'Football for players 35+. Focus on fitness, fun, and social interaction.'
            },
            {
                'name': 'Night League Championship',
                'location': 'Yaba Sports Complex',
                'date_time': timezone.now() + timedelta(days=8, hours=20),
                'coin_price': 1000,
                'total_slots': 22,
                'description': 'Premium night football under floodlights. Championship format with prizes.'
            },
            {
                'name': 'Beginner\'s Paradise',
                'location': 'Ikeja Football Ground',
                'date_time': timezone.now() + timedelta(days=9, hours=11),
                'coin_price': 200,
                'total_slots': 20,
                'description': 'Perfect for beginners. Learn the basics in a supportive environment.'
            }
        ]

        for game_data in games_data:
            game, created = Game.objects.get_or_create(
                name=game_data['name'],
                date_time=game_data['date_time'],
                defaults={**game_data, 'created_by': admin_user}
            )
            if created:
                self.stdout.write(f'Created game: {game.name}')
            else:
                self.stdout.write(f'Game already exists: {game.name}')

    def create_sample_users(self):
        """Create sample users."""
        users_data = [
            {
                'username': 'john_doe',
                'email': 'john@example.com',
                'first_name': 'John',
                'last_name': 'Doe',
                'coin_balance': 2500,
                'subscription_tier': 'silver'
            },
            {
                'username': 'jane_smith',
                'email': 'jane@example.com',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'coin_balance': 800,
                'subscription_tier': 'bronze'
            },
            {
                'username': 'mike_wilson',
                'email': 'mike@example.com',
                'first_name': 'Mike',
                'last_name': 'Wilson',
                'coin_balance': 5000,
                'subscription_tier': 'gold'
            },
            {
                'username': 'sarah_jones',
                'email': 'sarah@example.com',
                'first_name': 'Sarah',
                'last_name': 'Jones',
                'coin_balance': 1200,
                'subscription_tier': 'bronze'
            }
        ]

        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    **user_data,
                    'password': 'testpass123'
                }
            )
            if created:
                user.set_password('testpass123')
                user.save()
                self.stdout.write(f'Created user: {user.username}')
            else:
                self.stdout.write(f'User already exists: {user.username}')