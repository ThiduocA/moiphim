using System.Xml.Linq;
using Microsoft.EntityFrameworkCore;
using moiphim.Entities;

namespace moiphim.DataAccess.Entities;

public class moiphimDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Episode> Episodes { get; set; }
    public DbSet<Movie> Movies { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Country> Countries { get; set; }
    public DbSet<Actor> Actors { get; set; }
    public DbSet<Director> Directors { get; set; }
    public DbSet<Episode> Episode { get; set; }
    public DbSet<MovieCategory> MovieCategories { get; set; }
    public DbSet<MovieCountry> MovieCountries { get; set; }
    public DbSet<MovieActor> MovieActors { get; set; }
    public DbSet<MovieDirector> MovieDirectors { get; set; }
    public DbSet<TMDBInfo> TMDBInfos { get; set; }
    public DbSet<IMDbInfo> IMDbInfos { get; set; }

    public moiphimDbContext(DbContextOptions<moiphimDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Cấu hình quan hệ 1-N cho Episode - Anime
        modelBuilder.Entity<Episode>()
            .HasOne(e => e.Movie)
            .WithMany(a => a.Episodes)
            .HasForeignKey(e => e.MovieId);

        modelBuilder.Entity<MovieCategory>()
            .HasKey(mc => new { mc.MovieId, mc.CategoryId });

        modelBuilder.Entity<MovieCountry>()
            .HasKey(mc => new { mc.MovieId, mc.CountryId });

        modelBuilder.Entity<MovieActor>()
            .HasKey(ma => new { ma.MovieId, ma.ActorId });

        modelBuilder.Entity<MovieDirector>()
            .HasKey(md => new { md.MovieId, md.DirectorId });

        // One-to-One
        modelBuilder.Entity<TMDBInfo>()
            .HasOne(t => t.Movie)
            .WithOne(m => m.TMDBInfo)
            .HasForeignKey<TMDBInfo>(t => t.MovieId);

        modelBuilder.Entity<IMDbInfo>()
            .HasOne(i => i.Movie)
            .WithOne(m => m.IMDbInfo)
            .HasForeignKey<IMDbInfo>(i => i.MovieId);
    }
}
