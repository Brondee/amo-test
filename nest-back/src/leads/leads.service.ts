import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LeadsService {
  constructor(private readonly httpService: HttpService) {}

  url = 'https://westers07p.amocrm.ru/api/v4/';
  token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjkzMjg5NzBiY2Q2YWZlOWQ1ODk0ZDg0ZDZkZTM4N2M0OWI5ZTFlMjkzMDI2MzUzN2M3OTZmNzI4NjYyMTMzYjZkZmNmNGJjZDcwNjUzZjk4In0.eyJhdWQiOiI3MDIxNWQ0OC1hMzg0LTRiMzQtYTI5MC01MDNlNDRhYzU3NjciLCJqdGkiOiI5MzI4OTcwYmNkNmFmZTlkNTg5NGQ4NGQ2ZGUzODdjNDliOWUxZTI5MzAyNjM1MzdjNzk2ZjcyODY2MjEzM2I2ZGZjZjRiY2Q3MDY1M2Y5OCIsImlhdCI6MTcyMDAzMDM4MCwibmJmIjoxNzIwMDMwMzgwLCJleHAiOjE3MjQ5NzYwMDAsInN1YiI6IjExMjMwOTEwIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxODMxMDE4LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiZWM2YjMxMmMtZDYyNS00NmUzLWExYWEtNjA5OGZlZDUwOGI1In0.HYuLsmyIKsHg_RrOmEI6g5tfqIvnpzkd8TTJeGNX8aXF3yg_6qsW3QfebRX08puUEuWZbpe1dkeObVwxdtfMG0S0PEmaHGpWFFG-WNCOhXBk9fCEruEvr3ktL9esaWwraQBPiWoAuk_eqiJjTPnR0UvIE3nioe1S2sd8fpYfr-vkut-t5zJ5XfoCgv3Dv3pmKrkUQa8OA1guyCCZvSDiGFz35vN6syUp0SwsPAF7KVBF_LDqm2hSCIIVfNik_tuWqnuFomeda7UcKENPy_71EBj3iVId5vGlnrV5q_S0hNDPbILRLbRGBphyhlCbQ1lAgm8lvDtXqEwQumYmKTjxPw';

  async getAllLeads(query: string) {
    if (!query || query.length < 3) {
      query = '';
    }

    const { data } = await lastValueFrom(
      this.httpService.get(
        this.url + 'leads?with=contacts' + `&query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    if (data) {
      let newData = await Promise.all(
        data._embedded.leads.map(async (lead) => {
          const { responsible_user_id, _embedded, status_id, pipeline_id } =
            lead;
          let resp_name = await this.getPersonById(responsible_user_id);
          let client_name = await this.getContactById(_embedded.contacts[0].id);
          let status_name = await this.getStatusName(pipeline_id, status_id);
          return { ...lead, resp_name, client_name, status_name };
        }),
      );
      return newData;
    } else {
      return { error: 'no data' };
    }
  }

  async getPersonById(id: number) {
    const { data } = await lastValueFrom(
      this.httpService.get(this.url + `users/${id}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    if (data) {
      return data.name;
    } else {
      return { error: 'no data' };
    }
  }

  async getContactById(id: number) {
    const { data } = await lastValueFrom(
      this.httpService.get(this.url + `contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    if (data) {
      return data.name;
    } else {
      return { error: 'no data' };
    }
  }

  async getStatusName(pipline_id: number, status_id: number) {
    const { data } = await lastValueFrom(
      this.httpService.get(
        this.url + `leads/pipelines/${pipline_id}/statuses/${status_id}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    if (data) {
      return data.name;
    } else {
      return { error: 'no data' };
    }
  }
}
