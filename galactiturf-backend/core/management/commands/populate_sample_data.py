from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal
from core.models import SubscriptionTier, Game, UserProfile
import random


class Command(BaseCommand):
    help = 'Populate database with realistic sample data'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before populating',
        )
    
    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            Game.objects.all().delete()
            SubscriptionTier.objects.all().delete()
            # Don't delete users to preserve admin accounts
            
        self.stdout.write('Creating subscription tiers...')
        self.create_subscription_tiers()
        
        self.stdout.write('Creating sample games...')
        self.create_sample_games()
        
        self.stdout.write('Creating sample users...')
        self.create_sample_users()
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with sample data')
        )
    
    def create_subscription_tiers(self):
        """Create subscription tier data"""
        tiers_data = [
            {
                'name': 'Bronze',
                'price': Decimal('2500.00'),
                'coins_awarded': 1000,
                'description': 'Perfect for casual players. Get 1000 coins to book your favorite games.'
            },
            {
                'name': 'Silver',
                'price': Decimal('5000.00'),
                'coins_awarded': 2500,
                'description': 'Great value for regular players. Get 2500 coins with bonus rewards.'
            },
            {
                'name': 'Gold',
                'price': Decimal('10000.00'),
                'coins_awarded': 6000,
                'description': 'Best for avid players. Get 6000 coins with premium benefits and priority booking.'
            },
            {
                'name': 'Platinum',
                'price': Decimal('15000.00'),
                'coins_awarded': 10000,
                'description': 'Ultimate gaming experience. Get 10000 coins with exclusive access to premium games.'
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
        """Create realistic football game data"""
        # Lagos locations
        locations = [
            'National Stadium, Surulere, Lagos',
            'Teslim Balogun Stadium, Surulere, Lagos',
            'Agege Stadium, Agege, Lagos',
            'Campos Square Mini Stadium, Lagos Island',
            'University of Lagos Sports Complex, Akoka',
            'Lagos State University Sports Center, Ojo',
            'Ikoyi Club 1938, Ikoyi, Lagos',
            'Federal Palace Hotel Courts, Victoria Island',
            'Mainland Sports Club, Ebute Metta',
            'Gateway Football Academy, Sagamu Road'
        ]
        
        game_types = [
            '5-A-Side Tournament',
            '7-A-Side League Match',
            'Football Training Session',
            'Youth Championship',
            'Corporate Football League',
            'Weekend Football Challenge',
            'Evening Football Practice',
            'Inter-Community Match',
            'Veterans Football Game',
            'Ladies Football Tournament'
        ]
        
        # Generate games for the next 30 days
        start_date = timezone.now().date()
        
        for i in range(50):  # Create 50 games
            # Random date within next 30 days
            days_ahead = random.randint(1, 30)
            game_date = start_date + timedelta(days=days_ahead)
            
            # Random time between 6 AM and 10 PM
            hour = random.choice([6, 7, 8, 9, 10, 16, 17, 18, 19, 20, 21, 22])
            minute = random.choice([0, 30])
            
            game_datetime = timezone.make_aware(
                datetime.combine(game_date, datetime.min.time().replace(hour=hour, minute=minute))
            )
            
            # Random game details
            location = random.choice(locations)
            game_type = random.choice(game_types)
            coin_price = random.choice([150, 200, 250, 300, 400, 500, 750, 1000])
            total_slots = random.choice([10, 14, 16, 20, 22, 24, 28, 30])
            booked_slots = random.randint(0, min(total_slots - 2, total_slots // 2))
            
            # Generate description
            descriptions = [
                f"Join us for an exciting {game_type.lower()} at {location.split(',')[0]}. Perfect for players of all skill levels.",
                f"Experience competitive football in this {game_type.lower()}. Bring your A-game and meet fellow football enthusiasts.",
                f"Don't miss this thrilling {game_type.lower()}. Professional referees and quality equipment provided.",
                f"Book your spot for this amazing {game_type.lower()}. Great opportunity to showcase your skills.",
                f"Come and enjoy quality football in this {game_type.lower()}. All equipment and refreshments included."
            ]
            
            game_data = {
                'name': f"{game_type} - {location.split(',')[0]}",
                'location': location,
                'date_time': game_datetime,
                'coin_price': coin_price,
                'total_slots': total_slots,
                'booked_slots': booked_slots,
                'description': random.choice(descriptions),
                'is_active': True
            }
            
            game, created = Game.objects.get_or_create(
                name=game_data['name'],
                date_time=game_data['date_time'],
                defaults=game_data
            )
            
            if created:
                self.stdout.write(f'Created game: {game.name} on {game.date_time.strftime("%Y-%m-%d %H:%M")}')
    
    def create_sample_users(self):
        """Create sample users with profiles"""
        users_data = [
            {
                'username': 'john_player',
                'email': 'john@example.com',
                'first_name': 'John',
                'last_name': 'Okafor',
                'password': 'password123',
                'coins': 1500,
                'tier_name': 'Silver'
            },
            {
                'username': 'mary_footballer',
                'email': 'mary@example.com',
                'first_name': 'Mary',
                'last_name': 'Adebayo',
                'password': 'password123',
                'coins': 800,
                'tier_name': 'Bronze'
            },
            {
                'username': 'david_striker',
                'email': 'david@example.com',
                'first_name': 'David',
                'last_name': 'Eze',
                'password': 'password123',
                'coins': 3000,
                'tier_name': 'Gold'
            },
            {
                'username': 'sarah_defender',
                'email': 'sarah@example.com',
                'first_name': 'Sarah',
                'last_name': 'Mohammed',
                'password': 'password123',
                'coins': 500,
                'tier_name': 'Bronze'
            }
        ]
        
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                }
            )
            
            if created:
                user.set_password(user_data['password'])
                user.save()
                
                # Update profile
                profile = user.profile
                profile.coin_balance = user_data['coins']
                
                # Set subscription tier
                try:
                    tier = SubscriptionTier.objects.get(name=user_data['tier_name'])
                    profile.subscription_tier = tier
                except SubscriptionTier.DoesNotExist:
                    pass
                
                profile.save()
                
                self.stdout.write(f'Created user: {user.username} with {profile.coin_balance} coins')
            else:
                self.stdout.write(f'User already exists: {user.username}')