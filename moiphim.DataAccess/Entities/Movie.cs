using System.ComponentModel.DataAnnotations;

namespace moiphim.DataAccess.Entities;

public class Movie
{
    [Key]
    public string Id { get; set; }
    public string Name { get; set; }
    public string Slug { get; set; }
    public string OriginName { get; set; }
    public string Content { get; set; }
    public string Type { get; set; }
    public string Status { get; set; }
    public string PosterUrl { get; set; }
    public string ThumbUrl { get; set; }
    public string TrailerUrl { get; set; }
    public string Time { get; set; }
    public string EpisodeCurrent { get; set; }
    public int? EpisodeTotal { get; set; }
    public string Quality { get; set; }
    public string Lang { get; set; }
    public string Notify { get; set; }
    public string Showtimes { get; set; }
    public int? Year { get; set; }
    public int View { get; set; }
    public bool IsCopyright { get; set; }
    public bool SubDocquyen { get; set; }
    public bool ChieuRap { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? ModifiedAt { get; set; }

    public ICollection<MovieCategory> MovieCategories { get; set; }
    public ICollection<MovieCountry> MovieCountries { get; set; }
    public ICollection<MovieActor> MovieActors { get; set; }
    public ICollection<MovieDirector> MovieDirectors { get; set; }
    public ICollection<Episode> Episodes { get; set; }

    public TMDBInfo TMDBInfo { get; set; }
    public IMDbInfo IMDbInfo { get; set; }
}
