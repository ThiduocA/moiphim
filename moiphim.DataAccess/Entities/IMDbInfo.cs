using System.ComponentModel.DataAnnotations;

namespace moiphim.DataAccess.Entities;

public class IMDbInfo
{
    [Key]
    public string MovieId { get; set; }
    public Movie Movie { get; set; }

    public string IMDbId { get; set; }
}
