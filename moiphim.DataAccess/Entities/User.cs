using System.ComponentModel.DataAnnotations;
using moiphim.DataAccess.Entities;

namespace moiphim.Entities;

public class User
{
    [Key]
    public Guid UserId { get; set; }
    [Required]
    public string UserName { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime RegisterDate { get; set; }

    public bool IsActive { get; set; } = true;
    
    public string? AvatarUrl { get; set; }
    public string Role { get; set; } = "User";
}
