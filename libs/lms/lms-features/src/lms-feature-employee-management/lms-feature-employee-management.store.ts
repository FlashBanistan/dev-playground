import { Injectable } from '@angular/core';
import { LmsDataEmployeeService } from '@playground/lms-data';
import { LmsEmployee } from '@playground/lms/lms-util';
import { BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

interface EmployeeManagementState {
  employees: LmsEmployee[];
}

@Injectable({ providedIn: 'root' })
export class LmsFeatureEmployeeManagementStore {
  private employeeManagementStateSub =
    new BehaviorSubject<EmployeeManagementState>({
      employees: [],
    });

  private get employeeMangementState() {
    return this.employeeManagementStateSub.getValue();
  }

  // Selectors
  readonly employeeMangementState$ = this.employeeManagementStateSub
    .asObservable()
    .pipe(shareReplay());

  readonly employees$ = this.employeeMangementState$.pipe(
    map((state) => state.employees),
    shareReplay()
  );

  readonly employeeCount$ = this.employees$.pipe(
    map((employees) => employees.length),
    shareReplay()
  );

  // Reducers
  private patchState(state: Partial<EmployeeManagementState>) {
    this.employeeManagementStateSub.next({
      ...this.employeeMangementState,
      ...state,
    });
  }

  // Actions
  private fetchEmployees() {
    this.employeeService.getAll().subscribe((employees) => {
      this.patchState({ employees: employees });
    });
  }

  private fetchEmployee(employee: LmsEmployee) {
    this.employeeService.get(employee.id).subscribe((employees) => {
      // this.patchState({ employees: employees });
    });
  }

  deleteEmployee(employee: LmsEmployee) {
    // return this.employeeService.delete(employee.id).pipe().subscribe();
  }

  constructor(private employeeService: LmsDataEmployeeService) {
    this.fetchEmployees();
  }
}
