namespace moiphim.DataAccess.Entities;

public class MovieCountry
{
    public string MovieId { get; set; }
    public Movie Movie { get; set; }

    public string CountryId { get; set; }
    public Country Country { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
