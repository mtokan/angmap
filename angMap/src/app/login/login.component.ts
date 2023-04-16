import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public hide = true;

  public form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  public submitted = false;

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router:Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required]]
    });
  }

  get f(): {[key:string]: AbstractControl} {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.authenticationService.login(this.form.value['email'],this.form.value['password']).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
