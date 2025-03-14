import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef, NgZone, signal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type ColumnDataType = 'string' | 'number' | 'boolean' | 'date';

export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

export interface TableAction {
    label: string;
    icon?: string;
    action: (row: any) => void;
}

export interface TableColumn {
    title: string;
    field: string | ((row: any) => any);
    width: number;
    fixed?: boolean;
    responsivePriority?: number;
    visible?: boolean;
    editable?: boolean | ((row: any) => boolean);
    dataType: ColumnDataType | 'action';
    options?: Signal<SelectOption[]>;
    actions?: TableAction[];
}

@Component({
    selector: 'app-mws-table',
    templateUrl: './mws-table.component.html',
    styleUrls: ['./mws-table.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, FormsModule],
})
export class MWSTableComponent implements OnInit, AfterViewInit {
    @Input() set height(value: number | string) {
        if (typeof value === 'number') {
            this._height = `${value}px`;
        } else {
            this._height = value;
        }
    }
    get height(): string {
        return this._height;
    }
    private _height: string = '500px';

    @Input() set columns(value: TableColumn[]) {
        this._columns.set(value);
        this.separateColumns();
    }
    @Input() set data(value: any[]) {
        this._data.set(value);
        this.updateVisibleData();
    }
    @Output() rowSelectionChange = new EventEmitter<any[]>();
    @Output() columnsUpdated = new EventEmitter<TableColumn[]>();
    @Output() cellValueChange = new EventEmitter<{row: any, column: TableColumn, value: any}>();

    @ViewChild('fixedColumnsBodyContainer') fixedColumnsBodyContainer!: ElementRef;
    @ViewChild('scrollableColumnsBody') scrollableColumnsBody!: ElementRef;
    @ViewChild('scrollableColumnsHeader') scrollableColumnsHeader!: ElementRef;

    private _columns = signal<TableColumn[]>([]);
    private _data = signal<any[]>([]);

    fixedColumns = computed(() => this._columns().filter(col => col.fixed));
    scrollableColumns = computed(() => this._columns().filter(col => !col.fixed));

    selectedRows = new Set<any>();
    visibleData = signal<any[]>([]);
    scrollAnimationFrame: number | null = null;

    resizingColumn: TableColumn | null = null;
    startX: number = 0;
    startWidth: number = 0;

    rowHeight = 42;
    visibleRowsCount = 0;
    startIndex = 0;

    scrollbarWidth: number = 0;

    constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {
        this.calculateScrollbarWidth();
    }

    private calculateScrollbarWidth(): void {
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        document.body.appendChild(outer);

        const inner = document.createElement('div');
        outer.appendChild(inner);

        this.scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

        outer.parentNode?.removeChild(outer);
    }

    ngOnInit() {
        this.separateColumns();
    }

    ngAfterViewInit() {
        this.calculateVisibleRows();
        this.updateVisibleData();

        this.ngZone.runOutsideAngular(() => {
            this.scrollableColumnsBody.nativeElement.addEventListener('scroll', this.onBodyScroll.bind(this));
        });
        this.cdr.detectChanges();
    }

    separateColumns() {
        this.fixedColumns = computed(() => this._columns().filter(col => col.fixed));
        this.scrollableColumns = computed(() => this._columns().filter(col => !col.fixed));
    }

    calculateVisibleRows() {
        const tableBodyHeight = this.scrollableColumnsBody.nativeElement.clientHeight;
        this.visibleRowsCount = Math.ceil(tableBodyHeight / this.rowHeight) + 1;
    }

    updateVisibleData() {
        this.visibleData.set(this._data());
    }

    onBodyScroll = (): void => {
        if (this.scrollAnimationFrame) {
            cancelAnimationFrame(this.scrollAnimationFrame);
        }

        this.scrollAnimationFrame = requestAnimationFrame(() => {
            const scrollTop = this.scrollableColumnsBody.nativeElement.scrollTop;
            const newStartIndex = Math.floor(scrollTop / this.rowHeight);
            
            if (newStartIndex !== this.startIndex) {
                this.startIndex = newStartIndex;
                this.updateVisibleData();
                this.ngZone.run(() => this.cdr.detectChanges());
            }

            this.scrollableColumnsHeader.nativeElement.scrollLeft = this.scrollableColumnsBody.nativeElement.scrollLeft;
            this.fixedColumnsBodyContainer.nativeElement.scrollTop = this.scrollableColumnsBody.nativeElement.scrollTop;;

            this.scrollAnimationFrame = null;
        });
    }

    onRowSelect(row: any, event: any) {
        if (event.target.checked) {
            this.selectedRows.add(row);
        } else {
            this.selectedRows.delete(row);
        }
        this.rowSelectionChange.emit(Array.from(this.selectedRows));
    }

    onSelectAll(event: any) {
        console.log(event.target.checked, this.data);
        if (event.target.checked) {
            this.selectedRows = new Set(this._data());
        } else {
            this.selectedRows.clear();
        }
        this.rowSelectionChange.emit(Array.from(this.selectedRows));
    }

    isRowSelected(row: any): boolean {
        return this.selectedRows.has(row);
    }

    onResizeStart(event: MouseEvent, column: TableColumn) {
        event.preventDefault();
        this.resizingColumn = column;
        this.startX = event.pageX;
        this.startWidth = column.width;

        const mouseMoveHandler = (e: MouseEvent) => this.onResizing(e);
        const mouseUpHandler = () => this.onResizeEnd();

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }

    onResizing(event: MouseEvent) {
        if (!this.resizingColumn) return;

        const dx = event.pageX - this.startX;
        const newWidth = this.startWidth + dx;
        if (newWidth > 50) {
            this.resizingColumn.width = newWidth;
            this.columnsUpdated.emit(this.columns);
            this.cdr.detectChanges();
        }
    }

    onResizeEnd() {
        this.resizingColumn = null;
    }

    getCellClasses(rowIndex: number, colIndex: number): { [key: string]: boolean } {
        const column = this.scrollableColumns()[colIndex];
        let editable = false;
        editable = column?.editable ? true : editable;
        editable = column?.dataType === 'action' ? true : editable;

        return {
            'striped': rowIndex % 2 === 0,
            'selected': this.isRowSelected(this.visibleData()[rowIndex]),
            'editable': editable,
            [`col-${colIndex + this.fixedColumns.length}`]: true,
            [`type-${column?.dataType}`]: true,
        };
    }

    getFixedColumnLeftPosition(index: number): number {
        let leftPosition = 30; // Starting after the checkbox column
        for (let i = 0; i < index; i++) {
            leftPosition += this.fixedColumns()[i].width;
        }
        return leftPosition;
    }

    onCellValueChange(row: any, column: TableColumn, newValue: any) {
        // Para selects, newValue ya es el valor seleccionado
        if (column.options && column.options.length > 0) {
            this.setCellValue(row, column, newValue);
            this.cellValueChange.emit({row, column, value: newValue});
            return;
        }

        if (newValue instanceof InputEvent || newValue instanceof Event) {
            newValue = column.dataType == 'boolean' ? (newValue.target as HTMLInputElement).checked : (newValue.target as HTMLInputElement).value;
        }

        // Para otros tipos de inputs
        switch (column.dataType) {
            case 'number':
                newValue = parseFloat(newValue);
                break;
            case 'boolean':
                newValue = newValue === true || newValue === 'true';
                break;
            case 'date':
                newValue = new Date(newValue);
                break;
            // Para 'string', no necesitamos conversión
        }

        this.setCellValue(row, column, newValue);
        this.cellValueChange.emit({row, column, value: newValue});
    }

    getInputType(column: TableColumn): string {
        if (this.hasOptions(column)) {
            return 'select';
        }

        switch (column.dataType) {
            case 'number': return 'number';
            case 'boolean': return 'checkbox';
            case 'date': return 'date';
            default: return 'text';
        }
    }

    getColumnOptions(column: TableColumn): SelectOption[] {
        return column.options ? column.options() : [];
    }

    hasOptions(column: TableColumn): boolean {
        return !!column.options && this.getColumnOptions(column).length > 0;
    }

    getOptionLabel(column: TableColumn, value: string | number): string {
        const options = column.options ? column.options() : [];
        const option = options.find(opt => opt.value === value);
        return option ? option.label : value.toString();
    }

    isActionColumn(column: TableColumn): boolean {
        return (column.dataType === 'action' && column.actions && column.actions.length > 0) || false;
    }

    executeAction(action: TableAction, row: any) {
        action.action(row);
    }

    isCellEditable(column: TableColumn, row: any): boolean {
        if (typeof column.editable === 'function') {
            return column.editable(row);
        }
        return !!column.editable;
    }

    getCellValue(row: any, column: TableColumn): any {
        if (typeof column.field === 'function') {
            return column.field(row);
        }

        return row[column.field];
    }

    isCellChecked(row: any, column: TableColumn): boolean {
        if (typeof column.field === 'function') {
            const value = column.field(row);
            return this.toBoolean(value);
        }
        
        const value = row[column.field];
        return this.toBoolean(value);
    }
    
    private toBoolean(value: any): boolean {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') return value.toLowerCase() === 'true';
        if (typeof value === 'number') return value === 1;
        return false;
    }

    setCellValue(row: any, column: TableColumn, value: any): void {
        if (typeof column.field === 'function') {
            // Si field es una función, no podemos establecer el valor directamente
            console.warn('No se puede establecer el valor para una columna con field de tipo función');
            return;
        }
        row[column.field] = value;
    }
}