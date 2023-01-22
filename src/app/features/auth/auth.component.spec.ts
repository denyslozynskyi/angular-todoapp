import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateStore } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { click } from 'src/app/spec-helpers/functions.spec-helper';

import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [HttpClientModule, SharedModule],
      providers: [TranslateStore],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('changes registerMode on button click', () => {
    click(fixture, 'auth-toggle');
    fixture.detectChanges();
    expect(component.registerMode).toBe(true);

    click(fixture, 'auth-toggle');
    fixture.detectChanges();
    expect(component.registerMode).toBe(false);
  });
});
