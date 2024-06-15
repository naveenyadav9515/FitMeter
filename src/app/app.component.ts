import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public data: any;
  public foodList: any;
  public tableData: any;

  constructor(public api: ApiService) {}

  ngOnInit() {
    this.getData();
  }

  public prepareContent() {
    this.foodList = this.data[0].foodList;
    let intakeList = this.data[0].intake;
    this.tableData = this.data[0].intake;
    for (let i = 0; i < this.tableData.length; i++) {
      this.tableData[i].data = intakeList[i].date;
      this.tableData[i].day = intakeList[i].day;
      this.tableData[i].tKal = this.prepareTKal(intakeList[i]);
      this.tableData[i].tP = Math.floor(this.prepareTP(intakeList[i]));
      this.tableData[i].bodyWeight = intakeList[i].bodyWeight;
      this.tableData[i].meal1 = this.prepareMealList(intakeList[i].meal1);
      this.tableData[i].meal2 = this.prepareMealList(intakeList[i].meal2);
      this.tableData[i].meal3 = this.prepareMealList(intakeList[i].meal3);
      this.tableData[i].meal4 = this.prepareMealList(intakeList[i].meal4);
      this.tableData[i].meal5 = this.prepareMealList(intakeList[i].meal5);
      this.tableData[i].others = this.prepareMealList(intakeList[i].others);
    }
  }

  public prepareMealList(meal: any) {
    let str = '';
    meal.forEach((item: any) => {
      str = str + item.type + '(' + item.quantity + '), ';
    });
    return str;
  }

  public prepareTP(data: any) {
    let flatMeal = [
      ...data.meal1,
      ...data.meal2,
      ...data.meal3,
      ...data.meal4,
      ...data.meal5,
    ];
    return this.countProtien(flatMeal);
  }

  public prepareTKal(data: any) {
    let flatMeal = [
      ...data.meal1,
      ...data.meal2,
      ...data.meal3,
      ...data.meal4,
      ...data.meal5,
    ];
    return this.countCal(flatMeal);
  }

  public countProtien(meals: any) {
    let totalkal = 0;
    meals.forEach((meal: any) => {
      this.foodList.forEach((foodType: any) => {
        if (meal.type === foodType.name) {
          if (foodType.calcType == 'grams') {
            let multiplier = meal.quantity / 100;
            totalkal = totalkal + multiplier * foodType.protien;
          } else {
            let multiplier = meal.quantity;
            totalkal = totalkal + multiplier * foodType.protien;
          }
        }

        console.log(totalkal);
      });
    });
    return totalkal;
  }
  public countCal(meals: any) {
    let totalkal = 0;
    meals.forEach((meal: any) => {
      this.foodList.forEach((foodType: any) => {
        if (meal.type === foodType.name) {
          if (foodType.calcType == 'grams') {
            let multiplier = meal.quantity / 100;
            totalkal = totalkal + multiplier * foodType.kcal;
          } else {
            let multiplier = meal.quantity;
            totalkal = totalkal + multiplier * foodType.kcal;
          }
        }

        console.log(totalkal);
      });
    });
    return totalkal;
  }

  public getData() {
    this.api.getUsers().subscribe((data) => {
      this.data = data;
      this.prepareContent();
    });
  }
}
