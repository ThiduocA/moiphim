
namespace moiphim.Common.Errors
{
    public static class UserErrors
    {
        public static Error NotFound(Guid id) => new Error("UserNotFound", $"The user with Id '{id}' was not found");
        public static Error AlreadyExist(string email) => new Error("UserAlreadyExist", $"The user with Email: '{email}' already exists");
        public static Error InvalidCredentials => new Error("UserInvalid", "Invalid username or password.");
        public static Error Deactivated => new Error("UserDeactivated", "Your account has been deactivated");

    }
}
