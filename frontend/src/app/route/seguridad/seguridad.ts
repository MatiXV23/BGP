import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MiembrosMesaService } from '../../../shared/services/miembro-mesa.service';
import { AgentePolicialService } from '../../../shared/services/agente-policial.service';
import { ComisariasService } from '../../../shared/services/comisaria.service';
import { OrganismoEstadoService } from '../../../shared/services/organismo-estado.service';

@Component({
  selector: 'app-seguridad',
  imports: [],
  templateUrl: './seguridad.html',
  styleUrl: './seguridad.css',
})
export class Seguridad implements OnInit {
  private readonly miembroMesaService = inject(MiembrosMesaService);
  private readonly agentePolicialService = inject(AgentePolicialService);
  private readonly comisariaService = inject(ComisariasService);
  private readonly organismoEstadoService = inject(OrganismoEstadoService);
  private readonly cdr = inject(ChangeDetectorRef);

  mostrarFormulario = false;

  cantidadUsuarios = 0;
  cantidadMiembrosMesa = 0;
  cantidadAgentesPoliciales = 0;
  cantidadComisarias = 0;
  cantidadOrganismosEstado = 0;

  cargando = false;
  errorCarga = '';

  ngOnInit(): void {
    void this.cargarDatos();
  }

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  async cargarDatos(): Promise<void> {
    this.cargando = true;
    this.errorCarga = '';
    this.cdr.detectChanges();

    try {
      const [miembrosMesa, agentesPoliciales, comisarias, organismosEstado] = await Promise.all([
        this.miembroMesaService.getAll(),
        this.agentePolicialService.getAll(),
        this.comisariaService.getAll(),
        this.organismoEstadoService.getAll(),
      ]);

      this.cantidadUsuarios = 0;
      this.cantidadMiembrosMesa = miembrosMesa.length;
      this.cantidadAgentesPoliciales = agentesPoliciales.length;
      this.cantidadComisarias = comisarias.length;
      this.cantidadOrganismosEstado = organismosEstado.length;
    } catch (error) {
      console.error('Error al cargar datos de seguridad', error);
      this.errorCarga = 'No se pudieron cargar los datos de seguridad desde el backend.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}
