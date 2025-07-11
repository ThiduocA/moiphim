using System.ComponentModel.DataAnnotations;

namespace moiphim.DataAccess.Entities
{
    public class Actor
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<MovieActor> MovieActors { get; set; }
    }
}
