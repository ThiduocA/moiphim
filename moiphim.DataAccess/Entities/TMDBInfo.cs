using System.ComponentModel.DataAnnotations;

namespace moiphim.DataAccess.Entities;

public class TMDBInfo
{
    [Key]
    public string MovieId { get; set; }
    public Movie Movie { get; set; }

    public string Type { get; set; }
    public string TMDBId { get; set; }
    public int? Season { get; set; }
    public float VoteAverage { get; set; }
    public int VoteCount { get; set; }
}
