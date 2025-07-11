namespace moiphim.DataAccess.Entities;

public class MovieDirector
{
    public string MovieId { get; set; }
    public Movie Movie { get; set; }
    public int DirectorId { get; set; }
    public Director Director { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
