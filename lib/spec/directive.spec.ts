import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapModalModule } from '../index';

const html = ``;

describe('Component: ngx-bootstrap-modal', () => {
  let fixture: ComponentFixture<any>;
  let context: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [BootstrapModalModule]
    });
    TestBed.overrideComponent(TestComponent, {set: {template: html}});
    fixture = TestBed.createComponent(TestComponent);
    context = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('fixture should not be null', () => {
    expect(fixture).not.toBeNull();
  });
});

@Component({
  template: ''
})
class TestComponent {
}
