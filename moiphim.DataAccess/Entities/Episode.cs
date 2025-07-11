using System.ComponentModel.DataAnnotations;

namespace moiphim.DataAccess.Entities;

public class Episode
{
    [Key]
    public int Id { get; set; }
    public string MovieId { get; set; }
    public Movie Movie { get; set; }

    public string ServerName { get; set; }
    public string EpisodeName { get; set; }
    public string Slug { get; set; }
    public string Filename { get; set; }
    public string LinkEmbed { get; set; }
    public string LinkM3U8 { get; set; }

}
