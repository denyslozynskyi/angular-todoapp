import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserData } from '../features/user-page/userData.model';
import {
  baseUrl,
  expectedUser,
  mockedUserData,
  newUser,
} from '../spec-helpers/data.spec-helper';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    userService = TestBed.inject(UserService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('fetches user data on initialization', () => {
    spyOn(userService, 'fetchUserData');
    userService.ngOnInit();
    expect(userService.fetchUserData).toHaveBeenCalled();
  });

  it('fetches user data', () => {
    let userData: UserData | undefined;
    userService.fetchUserData().subscribe((fetchedUserData) => {
      userData = {
        name: fetchedUserData.user.name,
        email: fetchedUserData.user.email,
        id: fetchedUserData.user._id,
        creationDate: new Date(fetchedUserData.user.createdDate),
      };
    });

    const request = controller.expectOne(baseUrl + 'user/getuser');
    request.flush(mockedUserData);
    expect(userData).toEqual(expectedUser);
  });

  it('changes user data', () => {
    let actualMessage: string | undefined;
    userService
      .changeUserInfo(
        {
          name: 'test user',
          email: 'test email',
          id: 'test user',
          creationDate: new Date(2000, 11, 20),
        },
        'test 2 user',
        'test 2 email'
      )
      .subscribe((returnValue) => {
        actualMessage = returnValue.message;
      });

    const request = controller.expectOne({
      method: 'put',
      url: baseUrl + 'user/changeinfo',
    });
    request.flush({ message: 'User updated successfully' });
    expect(actualMessage).toEqual('User updated successfully');
    expect(userService.user).toEqual(newUser);
  });

  it('changes password', () => {
    let actualMessage: string | undefined;
    userService
      .changePassword('old password', 'new password')
      .subscribe((returnValue) => {
        actualMessage = returnValue.message;
      });

    const request = controller.expectOne({
      method: 'put',
      url: baseUrl + 'user/changepassword',
    });
    request.flush({ message: 'Password updated successfully' });
    expect(actualMessage).toEqual('Password updated successfully');
  });

  it('deletes user', () => {
    let actualMessage: string | undefined;
    userService.deleteUser().subscribe((returnValue) => {
      actualMessage = returnValue.message;
    });

    const request = controller.expectOne({
      method: 'delete',
      url: baseUrl + 'user/delete',
    });
    request.flush({ message: 'User deleted successfully' });
    expect(actualMessage).toEqual('User deleted successfully');
  });
});
