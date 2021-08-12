import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {
  @Input() symbol: string = "";
  @Input() gameStart: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if(this.symbol != "X" && this.symbol != "O")
    {
      this.symbol = "";
    }
  }

}
