namespace moiphim.Services.Models.ResponseModels.User
{
    public class UserResponseModel
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public DateTime RegisterDate { get; set; }
        public bool IsActive { get; set; }
        public string AvatarUrl { get; set; }
        public string Role { get; set; }
    }
}
