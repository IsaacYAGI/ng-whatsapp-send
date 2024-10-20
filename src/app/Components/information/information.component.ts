import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent {
  @Input() informationOrigin!: "home" | "test_message";
}
