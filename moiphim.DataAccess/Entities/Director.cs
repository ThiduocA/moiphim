namespace moiphim.DataAccess.Entities;

public class Director
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ICollection<MovieDirector> MovieDirectors { get; set; } = new List<MovieDirector>();
}
