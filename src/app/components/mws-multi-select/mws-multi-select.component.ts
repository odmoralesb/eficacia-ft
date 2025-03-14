import { Component, Input, Output, EventEmitter, OnInit, forwardRef, ElementRef, HostListener, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';

export interface MultiSelectOption {
    filter?: string;
    value: any;
    label: string;
}

export interface MultiSelectService<T> {
    search(url: string, username: string, page: number, pageSize: number, term: string | undefined): Observable<{items: T[]; total: number}>;
    transformData?(item: T, filter: string): MultiSelectOption;
}

@Component({
    selector: 'app-mws-multi-select',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './mws-multi-select.component.html',
    styleUrls: ['./mws-multi-select.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MWSMultiSelectComponent),
            multi: true
        }
    ]
})
export class MWSMultiSelectComponent<T = any> implements OnInit, OnChanges, ControlValueAccessor {
    @Input() service!: MultiSelectService<T>;
    @Input() transformFn?: (item: T) => MultiSelectOption;
    @Input() pageSize: number = 10;
    @Input() placeholder: string = 'Buscar...';
    @Input() url: string = '';
    @Input() username: string = '';
    @Input() multiple: boolean = true;
    @Input() reset: boolean = false;

    @Output() selectedItemsChange = new EventEmitter<MultiSelectOption[]>();
    @Output() selectedItemChange = new EventEmitter<MultiSelectOption>();

    @ViewChild('searchInput') searchInput!: ElementRef;

    selectedItems: MultiSelectOption[] = [];
    searchTerm$ = new Subject<string>();
    loading$ = new BehaviorSubject<boolean>(false);
    error$ = new BehaviorSubject<string | null>(null);
    page = 1;
    results: MultiSelectOption[] = [];
    hasMore = true;
    isDropdownOpen = false;
    private closeDropdownTimeout: any;

    private onChange: any = () => { };
    private onTouch: any = () => { };

    constructor(private elementRef: ElementRef) { }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.closeDropdown();
        }
    }

    ngOnInit() {
        if (!this.service) {
            throw new Error('MultiSelectService must be provided');
        }

        this.searchTerm$.pipe(
            debounceTime(300),
            tap(() => {
                this.loading$.next(true);
                this.page = 1;
                this.results = [];
            }),
            switchMap(term => this.searchItems(term))
        ).subscribe({
            next: (response) => {
                this.results = response.items.map(item => this.transformItem(item));
                this.hasMore = this.results.length < response.total;
                this.loading$.next(false);
                this.error$.next(null);

                if (this.results.length === 0 && !this.loading$.value) {
                    clearTimeout(this.closeDropdownTimeout);
                    this.closeDropdownTimeout = setTimeout(() => {
                        this.closeDropdown();
                    }, 1500);
                }
            },
            error: (error: HttpErrorResponse) => {
                const errorMessage = error.status === 0 ? 'No se pudo conectar con el servidor' : `Error ${error.status}: ${error.message}`;
                this.error$.next(errorMessage);
                this.loading$.next(false);

                clearTimeout(this.closeDropdownTimeout);
                this.closeDropdownTimeout = setTimeout(() => {
                    this.closeDropdown();
                }, 2000);
            }
        });
    }

    private transformItem(item: T): MultiSelectOption {
        if (this.transformFn) {
            return this.transformFn(item);
        }
        
        if (this.service.transformData) {
            return this.service.transformData(item, this.url);
        }
        
        // Si no se proporciona una función de transformación, asume que el item ya tiene el formato correcto
        return item as unknown as MultiSelectOption;
    }

    onChevronClick(event: Event): void {
        event.stopPropagation(); // Prevenir la propagación del evento
        if (this.isDropdownOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
            this.searchTerm$.next(''); // Trigger búsqueda con término vacío
            if (this.searchInput) {
                this.searchInput.nativeElement.value = '';
            }
        }
    }

    private searchItems(term: string) {
        return this.service.search(this.url, this.username, this.page, this.pageSize, term);
    }

    onSearch(event: Event): void {
        const term = (event.target as HTMLInputElement).value;
        this.searchTerm$.next(term);
        if (term) {
            this.openDropdown();
        } else {
            this.closeDropdown();
        }
    }

    onScroll(event: Event): void {
        const element = event.target as HTMLElement;
        if (
            !this.loading$.value &&
            this.hasMore &&
            element.scrollTop + element.clientHeight >= element.scrollHeight - 20
        ) {
            this.page++;
            const currentTerm = (document.querySelector('input[type="search"]') as HTMLInputElement).value;
            this.searchItems(currentTerm).subscribe({
                next: (response) => {
                    const newItems = response.items.map(item => 
                        this.transformItem(item)
                    );
                    this.results = [...this.results, ...newItems];
                    this.hasMore = this.results.length < response.total;
                },
                error: (error: HttpErrorResponse) => {
                    this.error$.next('Error al cargar más resultados');
                }
            });
        }
    }

    isSelected(item: MultiSelectOption): boolean {
        return this.selectedItems.some(selected => selected.value === item.value);
    }

    selectItem(item: MultiSelectOption): void {
        if (this.multiple) {
            // Modo de selección múltiple
            if (!this.isSelected(item)) {
                this.selectedItems = [...this.selectedItems, item];
                this.onChange(this.selectedItems);
                this.onTouch();
                this.selectedItemsChange.emit(this.selectedItems);
            }
        } else {
            // Modo de selección única
            this.selectedItems = [item];
            this.onChange(this.selectedItems);
            this.onTouch();
            this.selectedItemsChange.emit(this.selectedItems);
            this.selectedItemChange.emit(item); // Emitir el item seleccionado individualmente
        }

        if (this.searchInput) {
            this.searchInput.nativeElement.value = '';
            this.results = [];
        }
        this.closeDropdown();
    }

    removeItem(item: MultiSelectOption): void {
        if (this.multiple) {
            // En modo múltiple, eliminar el item seleccionado
            this.selectedItems = this.selectedItems.filter(selected => selected.value !== item.value);
        } else {
            // En modo único, limpiar la selección
            this.selectedItems = [];
            this.selectedItemChange.emit(undefined as any);
        }
        this.onChange(this.selectedItems);
        this.onTouch();
        this.selectedItemsChange.emit(this.selectedItems);
    }

    clearSelection(): void {
        this.selectedItems = [];
        this.onChange(this.selectedItems);
        this.onTouch();
        this.selectedItemsChange.emit(this.selectedItems);
        if (!this.multiple) {
            this.selectedItemChange.emit(undefined as any);
        }
        // Limpiar el input de búsqueda si existe
        if (this.searchInput) {
            this.searchInput.nativeElement.value = '';
        }
    }

    openDropdown(): void {
        this.isDropdownOpen = true;
    }

    closeDropdown(): void {
        this.isDropdownOpen = false;
        clearTimeout(this.closeDropdownTimeout);
    }

    writeValue(value: MultiSelectOption[]): void {
        if (value) {
            this.selectedItems = value;
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    ngOnDestroy() {
        clearTimeout(this.closeDropdownTimeout);
    }

    ngOnChanges(changes: SimpleChanges) {
        // Detectar cambios en la propiedad reset
        if (changes['reset'] && changes['reset'].currentValue === true) {
            this.clearSelection();
            if (this.searchInput) {
                this.searchInput.nativeElement.value = '';
            }
            this.closeDropdown();
            this.results = [];
        }
    }
}