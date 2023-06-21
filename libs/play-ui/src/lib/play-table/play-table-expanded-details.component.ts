import { CdkTableModule } from '@angular/cdk/table';
import {
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PlayTableColumn, PlayTableRow } from './play-table.interface';
import { PlayTableDataSource } from './play-table.component';

@Component({
  selector: 'play-table-expanded-details',
  templateUrl: './play-table-expanded-details.component.html',
  styleUrls: [
    // './play-table.component.scss',
    './play-table-expanded-details.component.scss',
  ],
  standalone: true,
  imports: [
    CdkTableModule,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NgIf,
    NgFor,
  ],
})
export class PlayTableExpandedDetailsComponent implements OnInit {
  @Input() columns: PlayTableColumn[];
  @Input() rows: PlayTableRow[];
  @Input() level: number;

  dataSource = new PlayTableDataSource();
  expandedRow: PlayTableRow | null;
  ngOnInit() {
    this.dataSource.data.next(this.rows);
    console.log('columns: ', this.columns);
  }

  get displayedColumns(): string[] {
    return this.columns.map((c) => c.key);
  }

  onRowClick(row: PlayTableRow) {
    if (this.expandedRow === row) {
      this.expandedRow = null;
    } else {
      this.expandedRow = row;
    }
  }
}