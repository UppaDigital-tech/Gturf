from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from subscriptions.models import SubscriptionTier
from games.models import Game


class Command(BaseCommand):
    help = 'Populate database with sample data for Galactiturf'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create subscription tiers
        self.create_subscription_tiers()
        
        # Create sample games
        self.create_sample_games()
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )

    def create_subscription_tiers(self):
        """Create sample subscription tiers."""
        tiers_data = [
            {
                'name': 'Bronze Package',
                'tier_type': 'bronze',
                'price': 10.00,
                'coins_awarded': 1000,
                'description': 'Perfect for beginners. Get 1000 coins to start booking games.',
            },
            {
                'name': 'Silver Package',
                'tier_type': 'silver',
                'price': 45.00,
                'coins_awarded': 5000,
                'description': 'Great value for regular players. Get 5000 coins with 10% bonus.',
            },
            {
                'name': 'Gold Package',
                'tier_type': 'gold',
                'price': 80.00,
                'coins_awarded': 10000,
                'description': 'Best value for serious players. Get 10000 coins with 20% bonus.',
            },
            {
                'name': 'Platinum Package',
                'tier_type': 'platinum',
                'price': 150.00,
                'coins_awarded': 20000,
                'description': 'Premium package for elite players. Get 20000 coins with 30% bonus.',
            },
        ]
        
        for tier_data in tiers_data:
            tier, created = SubscriptionTier.objects.get_or_create(
                tier_type=tier_data['tier_type'],
                defaults=tier_data
            )
            if created:
                self.stdout.write(f'Created subscription tier: {tier.name}')
            else:
                self.stdout.write(f'Subscription tier already exists: {tier.name}')

    def create_sample_games(self):
        """Create sample football games."""
        games_data = [
            {
                'name': 'Weekend Warriors',
                'location': 'Central Park Football Field, Lagos',
                'date_time': timezone.now() + timedelta(days=2, hours=14),
                'coin_price': 500,
                'total_slots': 22,
                'description': 'Casual weekend game for all skill levels. Bring your own cleats!',
                'rules': 'Standard 11v11 format. No aggressive play. Respect all players.',
            },
            {
                'name': 'Monday Night Football',
                'location': 'Victoria Island Sports Complex',
                'date_time': timezone.now() + timedelta(days=5, hours=19),
                'coin_price': 750,
                'total_slots': 18,
                'description': 'Evening game under floodlights. Intermediate to advanced players.',
                'rules': '9v9 format. Competitive but friendly. Proper football attire required.',
            },
            {
                'name': 'Wednesday Champions League',
                'location': 'Lekki Football Academy',
                'date_time': timezone.now() + timedelta(days=7, hours=16),
                'coin_price': 1000,
                'total_slots': 20,
                'description': 'High-intensity game for experienced players. Professional coaching available.',
                'rules': '10v10 format. Competitive play. Full kit provided.',
            },
            {
                'name': 'Friday Night Lights',
                'location': 'Ikoyi Sports Club',
                'date_time': timezone.now() + timedelta(days=9, hours=20),
                'coin_price': 800,
                'total_slots': 16,
                'description': 'Exclusive evening game at premium location. Limited slots available.',
                'rules': '8v8 format. Premium experience. Refreshments included.',
            },
            {
                'name': 'Sunday Family Fun',
                'location': 'Surulere Recreation Ground',
                'date_time': timezone.now() + timedelta(days=11, hours=10),
                'coin_price': 300,
                'total_slots': 30,
                'description': 'Family-friendly game. All ages welcome. Great for beginners.',
                'rules': '15v15 format. Mixed teams. Fun-focused play.',
            },
            {
                'name': 'Tuesday Training Session',
                'location': 'Yaba Technical College Field',
                'date_time': timezone.now() + timedelta(days=12, hours=17),
                'coin_price': 600,
                'total_slots': 24,
                'description': 'Training-focused session with skill development drills.',
                'rules': '12v12 format. Training drills included. Coaching provided.',
            },
            {
                'name': 'Thursday Elite Match',
                'location': 'Banana Island Sports Facility',
                'date_time': timezone.now() + timedelta(days=14, hours=18),
                'coin_price': 1200,
                'total_slots': 14,
                'description': 'Elite level game for professional and semi-professional players.',
                'rules': '7v7 format. High skill level required. Professional referees.',
            },
            {
                'name': 'Saturday Morning Kickoff',
                'location': 'Opebi Sports Center',
                'date_time': timezone.now() + timedelta(days=16, hours=8),
                'coin_price': 400,
                'total_slots': 26,
                'description': 'Early morning game to start your weekend right.',
                'rules': '13v13 format. Early bird special. Coffee and snacks provided.',
            },
        ]
        
        for game_data in games_data:
            game, created = Game.objects.get_or_create(
                name=game_data['name'],
                date_time=game_data['date_time'],
                defaults=game_data
            )
            if created:
                self.stdout.write(f'Created game: {game.name}')
            else:
                self.stdout.write(f'Game already exists: {game.name}')