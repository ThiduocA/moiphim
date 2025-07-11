using System.ComponentModel.DataAnnotations;

namespace moiphim.DataAccess.Entities
{
    public class Country
    {
        [Key]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }

        public ICollection<MovieCountry> MovieCountries { get; set; }
    }
}
