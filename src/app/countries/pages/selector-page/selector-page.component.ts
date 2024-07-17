import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { delay, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``,
})
export class SelectorPageComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}

  countriesByRegion: SmallCountry[] = [];
  loader: boolean = false;

  myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  ngOnInit(): void {
    this.onRegionChange();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChange(): void {
    this.myForm
    .get('region')!
    .valueChanges.pipe(
      tap(() => this.myForm.get('country')?.setValue('')),
        switchMap((region) =>
          this.countriesService.getCountriesByRegion(region)
        )
      )
      .subscribe((countries) => {
        this.loader = true;
        this.countriesByRegion = countries;
        this.loader = false;
      });
  }
}
