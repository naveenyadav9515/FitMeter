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

  // input section
  public mealMode: Number = 1;
  public mealObj: any = {
    date: new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
    }).format(new Date()),
    bodyWeight: '61',
    meal1: [
      {
        type: 'roti',
        quantity: 100,
      },
      {
        type: 'curry',
        quantity: 100,
      },
      {
        type: 'egg',
        quantity: 0,
      },
    ],
    meal2: [
      {
        type: 'rice',
        quantity: 200,
      },
      {
        type: 'curry',
        quantity: 100,
      },
      {
        type: 'egg',
        quantity: 0,
      },
    ],
    meal3: [
      {
        type: 'egg',
        quantity: 2,
      },
      {
        type: 'banana',
        quantity: 0,
      },
      {
        type: 'egg',
        quantity: 0,
      },
    ],
    meal4: [
      {
        type: 'banana',
        quantity: 2,
      },
      {
        type: 'egg',
        quantity: 0,
      },
      {
        type: 'egg',
        quantity: 0,
      },
    ],
    meal5: [
      {
        type: 'milk',
        quantity: 100,
      },
      {
        type: 'muesli',
        quantity: 50,
      },
      {
        type: 'egg',
        quantity: 0,
      },
    ],
    others: [
      {
        type: 'egg',
        quantity: 0,
      },
      {
        type: 'egg',
        quantity: 0,
      },
      {
        type: 'egg',
        quantity: 0,
      },
    ],
  };
  public backUpData = JSON.parse(JSON.stringify(this.mealObj));
  public editMode = false;

  constructor(public api: ApiService) {}

  ngOnInit() {
    this.getData();
  }

  public save() {
    this.api.getUsers().subscribe((data) => {
      this.data = data;
      this.mealObj.id = (
        Number(this.data.intake[this.data.intake.length - 1].id) + 1
      ).toString();
      this.data.intake.push(this.mealObj);
      this.api.addMealData(data).subscribe(() => {
        this.getData();
        this.mealObj = JSON.parse(JSON.stringify(this.backUpData));
      });
    });
  }
  public updateData() {
    this.api.getUsers().subscribe((data) => {
      this.data = data;
      this.data.intake.splice(
        this.data.intake.findIndex((item: any) => item.id === this.mealObj.id),
        1
      );
      this.data.intake.push(this.mealObj);
      this.data.intake.sort(
        (a: { id: number }, b: { id: number }) => a.id - b.id
      );
      this.api.addMealData(data).subscribe(() => {
        this.getData();
        this.mealObj = JSON.parse(JSON.stringify(this.backUpData));
        this.editMode = false;
      });
    });
  }
  public deleteMeal(mealId: any) {
    this.api.getUsers().subscribe((data) => {
      this.data = data;
      this.data.intake.splice(
        this.data.intake.findIndex((item: any) => item.id === mealId),
        1
      );

      this.api.addMealData(data).subscribe(() => {
        this.getData();
      });
    });
  }
  public editMeal(mealId: any) {
    this.api.getUsers().subscribe((data) => {
      this.data = data;
      this.editMode = true;
      this.mealObj = this.data.intake.find((item: any) => item.id === mealId);
    });
  }

  public prepareContent() {
    this.foodList = this.data.foodList;
    let intakeList = this.data.intake;
    this.tableData = this.data.intake;
    for (let i = 0; i < this.tableData.length; i++) {
      this.tableData[i].data = intakeList[i].date;
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
