using System;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Qantor.Currencies;
using Qantor.DataAccess;
using Qantor.DataAccess.Dao;
using Qantor.Helpers;

namespace Qantor
{
    public class Startup
    {
        public Startup(IHostingEnvironment hostingEnvironment)
        {
            var builder = new ConfigurationBuilder().SetBasePath(hostingEnvironment.ContentRootPath)
                .AddJsonFile("appsettings.json");
            Configuration = builder.Build();
        }

        private IConfiguration Configuration { get; }

        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<ICurrencyService, CurrencyService>(x => new CurrencyService { CurrenciesUri = GetCurrenciesUri() });
            services.AddRouting(routes => routes.LowercaseUrls = true);
            services.AddMvc();
            services.AddAutoMapper();
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            services.AddScoped<IUserDao, UserDao>();
            services.AddScoped<IUserAccountDao, UserAccountDao>();
            services.AddScoped<IUserTransactionDao, UserTransactionDao>();

            var appSettingsSection = Configuration.GetSection("SecretKey");
            services.Configure<AppSettings>(appSettingsSection);

            return services.BuildServiceProvider();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseMvc(routes => routes
                .MapRoute("Default", "{controller}/{action}", new { controller = "home", action = "index" })
                .MapRoute("ById", "{controller}/{id}/{action}"));

            app.UseStaticFiles();
        }

        private Uri GetCurrenciesUri()
        {
            return new Uri(Configuration.GetValue<string>("CurrenciesUri"));
        }
    }
}