import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { EmployeeModel } from './employee-dashboard.model';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})

export class EmployeeDashboardComponent implements OnInit {

  formValue !: FormGroup;
  employeeModelObj : EmployeeModel = new EmployeeModel();
  employeeData !: any;
  showAdd !: boolean;
  showUpdate !: boolean;

  constructor(private formbuilder: FormBuilder,
    private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = new FormGroup({
      date : new FormControl('',Validators.required),
      projectName : new FormControl('',Validators.required),
      utilizationHours : new FormControl('', [Validators.required, Validators.minLength(1)]),
      remark : new FormControl('')
    })
    this.getAllEmployee();
  }

  get date(){
    return this.formValue.get('date');
  }

  get projectName(){
    return this.formValue.get('projectName');
  }

  get utilizationHours(){
    return this.formValue.get('utilizationHours');
  }


  clickAddProject(){
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  postEmployeeDetails(){
    this.employeeModelObj.date = this.formValue.value.date;
    this.employeeModelObj.projectName = this.formValue.value.projectName;
    this.employeeModelObj.utilizationHours = this.formValue.value.utilizationHours;
    this.employeeModelObj.remark = this.formValue.value.remark;

    this.api.postEmployee(this.employeeModelObj)
    .subscribe(res=>{
      console.log(res);
      alert("Details Added Successfully")
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.getAllEmployee();
    },
    err=>{
      alert("Something went wrong")
    })
  }

  getAllEmployee(){
    this.api.getEmployee()
    .subscribe(res=>{
      this.employeeData = res;
    })
  }

  deleteEmployee(row:any){
    this.api.deleteEmployee(row.id)
    .subscribe(res=>{
      alert("Project will be deleted");
      this.getAllEmployee();
    })
  }

  onEdit(row:any){
    this.showAdd = false;
    this.showUpdate = true;
    this.employeeModelObj.id = row.id;
    this.formValue.controls['date'].setValue(row.date);
    this.formValue.controls['projectName'].setValue(row.projectName);
    this.formValue.controls['utilizationHours'].setValue(row.utilizationHours);
    this.formValue.controls['remark'].setValue(row.remark);

  }

  updateEmployeeDetails(){
    this.employeeModelObj.date = this.formValue.value.date;
    this.employeeModelObj.projectName = this.formValue.value.projectName;
    this.employeeModelObj.utilizationHours = this.formValue.value.utilizationHours;
    this.employeeModelObj.remark = this.formValue.value.remark;
    this.api.updateEmployee(this.employeeModelObj, this.employeeModelObj.id)
    .subscribe(res=>{
      alert("Updated Successfully")
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.getAllEmployee();
    })
  }

}
