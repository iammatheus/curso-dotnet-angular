import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  eventos: any = [];
  eventosFiltrados: any = [];
  largImg = 75;
  altImg = 50;
  margemImg = 2;
  exibirImg = true;
  private _filtroLista: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getEventos();
  }

  getEventos(): void {
    this.http.get('https://localhost:5001/api/eventos')
    .subscribe(res => {
      this.eventos = res;
      this.eventosFiltrados = this.eventos;
    },
      error => console.log(error)
    )
  }

  filtrarEventos(filtrarPor: string): any{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: any) =>
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
      );
  }

  exibirImagem(){
    this.exibirImg = !this.exibirImg;
  }

  get filtroLista(): string{
    return this._filtroLista;
  }

  set filtroLista(filtro: string){
    this._filtroLista = filtro;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }
}
