import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Doctor } from '../../../core/services/doctor';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions } from '@angular/material/card';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, NgIf, MatCardActions],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent {
  @Input() users: Doctor[] = [];
  @Input() displayedColumns: string[] = ['id', 'name', 'email', 'actions'];
  @Input() title: string = '';
  @Input() addButtonLabel: string = 'Add User';

  @Output() addUser = new EventEmitter<void>();
  @Output() editUser = new EventEmitter<Doctor>();
  @Output() removeUser = new EventEmitter<Doctor>();

  onAddUser(): void {
    this.addUser.emit();
  }

  onEditUser(user: Doctor): void {
    this.editUser.emit(user);
  }

  onRemoveUser(user: Doctor): void {
    this.removeUser.emit(user);
  }
}