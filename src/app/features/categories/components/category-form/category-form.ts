import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryForm implements OnChanges {

  @Input()
  category: Category | null = null;

  @Output()
  save = new EventEmitter<any>();

  private fb = inject(FormBuilder);

  categoryForm = this.fb.group({

    name: [

      '',

      [
        Validators.required,
        Validators.minLength(3)
      ]

    ],

    description: [

      '',

      [
        Validators.required,
        Validators.minLength(5)
      ]

    ]

  });

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['category'] && this.category) {

      this.categoryForm.patchValue({

        name: this.category.name,

        description: this.category.description

      });

    }

  }

  submit(): void {

    if (this.categoryForm.invalid) {

      this.categoryForm.markAllAsTouched();

      return;

    }

    this.save.emit(this.categoryForm.getRawValue());

  }

  hasError(control: string): boolean {

    const field = this.categoryForm.get(control);

    return !!field && field.invalid && field.touched;

  }

}