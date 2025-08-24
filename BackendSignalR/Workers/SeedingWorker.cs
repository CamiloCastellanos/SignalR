using BackendSignalR.Context;
using BackendSignalR.Model;
using Microsoft.EntityFrameworkCore;

namespace BackendSignalR.Workers
{
    public class SeedingWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public SeedingWorker(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await SeedDataAsync();
        }

        private async Task SeedDataAsync()
        {
            using var scope = _scopeFactory.CreateScope();
            await using var context = scope.ServiceProvider.GetRequiredService<DataContext>();

            // ✅ Asegura que la BD y tablas existen
            await context.Database.EnsureCreatedAsync();

            // Si ya hay datos, no volver a insertarlos
            if (await context.FoodItems.AnyAsync())
            {
                return;
            }

            var foodItems = new List<FoodItem>
            {
                new ()
                {
                    Name = "Pizza",
                    Description =
                        "A savory dish of Italian origin consisting of a usually round, flattened base of leavened wheat-based dough topped with tomatoes, cheese, and often various other ingredients.",
                    ImageUrl = "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500"
                },
                new ()
                {
                    Name = "Sushi",
                    Description =
                        "A Japanese dish of prepared vinegared rice (sushi-meshi), usually with some sugar and salt, accompanied by a variety of ingredients.",
                    ImageUrl = "https://plus.unsplash.com/premium_photo-1670333291474-cb722ca783a5?q=80&w=500"
                },
                new ()
                {
                    Name = "Hamburger",
                    Description =
                        "A sandwich consisting of one or more cooked patties of ground meat, usually beef, placed inside a sliced bread roll or bun.",
                    ImageUrl = "https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?w=500"
                },
                new ()
                {
                    Name = "Salad",
                    Description = "The most amazing salad that has ever passed your lips.",
                    ImageUrl = "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?w=500"
                }
            };

            await context.FoodItems.AddRangeAsync(foodItems);
            await context.SaveChangesAsync();

            Console.WriteLine("✅ Seeding complete!");
        }
    }
}
