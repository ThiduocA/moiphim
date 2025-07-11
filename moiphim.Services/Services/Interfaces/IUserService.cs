
using moiphim.Services.Models.RequestModels.User;
using moiphim.Services.Results;

namespace moiphim.Services.Services.Interfaces;

public interface IUserService
{
    Task<Result> RegisterUser(RegisterModelRequest model);
    Task<Result> Login(LoginModelRequest model);
    Task<Result> GetAllUsers();
    Task<Result> GetUserByUserName(string name);
    Task<Result> CreateUser(CreateUserRequest request);
    Task<Result> UpdateUserById(UpdateUserRequest request, Guid id);
    Task<Result> DeleteUserById(Guid id);
    Task<Result> ChangePassword(ChangePasswordModelRequest model);
}
