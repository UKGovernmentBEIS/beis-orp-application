import { IsEmail, Matches } from 'class-validator';

const passwordRegEx =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ])[A-Za-z0-9^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]{8,256}$/;

export default class AuthRegisterDto {
  @IsEmail(
    {},
    {
      message:
        'Enter your email in the correct format, such as name@example.com',
    },
  )
  email: string;

  @Matches(passwordRegEx, {
    message: 'Password must satisfy the criteria above',
  })
  password: string;
}
