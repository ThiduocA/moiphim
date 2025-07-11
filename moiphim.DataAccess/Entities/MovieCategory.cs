namespace moiphim.DataAccess.Entities;

public class MovieCategory
{
    public string MovieId { get; set; }
    public Movie Movie { get; set; }
    public string CategoryId { get; set; }
    public Category Category { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
