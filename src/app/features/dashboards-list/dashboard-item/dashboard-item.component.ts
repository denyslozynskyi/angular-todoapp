import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Dashboard } from '../dashboard.model';

@Component({
  selector: 'app-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.css']
})
export class DashboardItemComponent implements OnInit {
  @Input() dashboard: Dashboard | undefined;
  @Input() index: number | undefined;
  @Input() isDeleteDashboard: boolean | undefined;
  @Output('openModal') openModal = new EventEmitter<{ dashboard: Dashboard | undefined, index: number | undefined }>();
  isEdit = false;

  constructor() { }

  ngOnInit(): void {
  }

  onOpenModal() {
    this.openModal.emit({
      dashboard: this.dashboard,
      index: this.index
    });
  }

  onEdit() {
    this.isEdit = !this.isEdit;
  }

  onCloseForm() {
    this.isEdit = false;
  }

  cutDescription(descr: string | undefined) {
    if(descr !== undefined && descr.length >= 70) {
      return descr.substring(0, 70) + '...';
    }
    return descr;
  }
}
