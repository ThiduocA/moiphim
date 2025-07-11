namespace moiphim.DataAccess.Entities;

public class MovieActor
{
    public string MovieId { get; set; }
    public Movie Movie { get; set; }

    public int ActorId { get; set; }
    public Actor Actor { get; set; }
}
