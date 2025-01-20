import { PageHolder } from './abstractClasses';
import { HomePage } from './page/home.page';
import { SignInPage } from './page/signIn.page';
import { PatientsListPage } from './page/patientsList.page';
import { PatientPage } from './page/patient.page';
import { ReceptionPage } from './page/reception.page';
import { API } from '../api/api';
import { MedicalRecordsPage } from './page/medicalRecords.page';
import { ProcedurePage } from './page/procedure.page';
import { DiagnosticReportPage } from './page/diagnosticReport.page';
import { LoginFormModel } from '../models/loginForm.model';
import { LoginBuilder } from '../api/builders/login.builder';
import { Doctor } from '../models/doctor.model';

export class Application extends PageHolder {
  public api = new API(this.page.request);
  public signIn = new SignInPage(this.page);
  public home = new HomePage(this.page);
  public patientsList = new PatientsListPage(this.page);
  public patient = new PatientPage(this.page);
  public reception = new ReceptionPage(this.page);
  public medicalRecords = new MedicalRecordsPage(this.page);
  public procedure = new ProcedurePage(this.page);
  public diagnosticReport = new DiagnosticReportPage(this.page);

  async headlessLogin(doctor: Doctor) {
    const loginData = new LoginBuilder(doctor.email, doctor.password).build();
    const token = await this.api.auth.login(loginData);
    const authData = {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
    };
    await this.api.auth.getCookie(authData);
    await this.api.auth.getUserInfo();
  }
}
