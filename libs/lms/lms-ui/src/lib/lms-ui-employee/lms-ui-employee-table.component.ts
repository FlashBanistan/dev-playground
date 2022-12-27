import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LmsEmployee } from '@playground/lms/lms-util';
import { PlayCheckboxComponent } from '@playground/play-ui';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'lms-ui-employee-table',
  templateUrl: './lms-ui-employee-table.component.html',
  styleUrls: ['./lms-ui-employee-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, PlayCheckboxComponent],
})
export class LmsUiEmployeeTableComponent {
  @Input() employees: LmsEmployee[] = [];

  selection = new SelectionModel<LmsEmployee>(true, []);

  toggleSelectAll() {
    if (this.employees.length === this.selection.selected.length) {
      this.selection.clear();
    } else {
      this.selection.setSelection(...this.employees);
    }
  }

  trackByEmployeeFn(index: number, employee: LmsEmployee) {
    return employee.id;
  }
}