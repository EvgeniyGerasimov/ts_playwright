import { BaseController } from './base.controller';
import { EventModel, EventPeriod, EventReason } from '../../models/event.model';
import { Diagnose } from '../../models/diagnose.model';
import { Episode } from '../../models/episode.model';
import { step } from '../../utils/step';

export class EventController extends BaseController {
  @step('Create event')
  async createEvent(data: EventModel) {
    return (await this.request()
      .url('/api/event?force=true')
      .body(data).method('POST')
      .send()
    ).body;
  }

  @step('Add ICPC2 reason to event')
  async addIcpc2ReasonToEvent(eventId: string, encounterId: string, data: EventReason) {
    return (
      await this.request()
        .url(`/api/events/${eventId}/encounters/${encounterId}/reasons`)
        .body(data)
        .method('POST')
        .send()
    ).body;
  }

  @step('Add ICPC2 action to event')
  async addIcpc2ActionToEvent(eventId: string, encounterId: string, data: EventReason) {
    return (
      await this.request()
        .url(`/api/events/${eventId}/encounters/${encounterId}/actions`)
        .body(data)
        .method('POST')
        .send()
    ).body;
  }

  @step('Add diagnoses to event')
  async addDiagnosesToEvent(eventId: string, encounterId: string, data: Diagnose) {
    return (
      await this.request()
        .url(`/api/events/${eventId}/encounters/${encounterId}/diagnoses`)
        .body(data)
        .method('POST')
        .send()
    ).body;
  }

  @step('Set Event Period')
  async setEventPeriod(eventId: string, encounterId: string, data: EventPeriod) {
    return (
      await this.request()
        .url(`/api/events/${eventId}/encounters/${encounterId}`)
        .body(data)
        .method('PATCH')
        .send()
    ).body;
  }

  @step('Create Episode')
  async createEpisode(eventId: string, encounterId: string, data: Episode) {
    return (
      await this.request()
        .url(`/api/events/${eventId}/encounters/${encounterId}`)
        .body(data)
        .method('PATCH')
        .send()
    ).body;
  }

  @step('Add services to event')
  async addServiceToEvent(eventId: string, encounterId: string, data: any) {
    return (
      await this.request()
        .url(`/api/events/${eventId}/encounters/${encounterId}/services`)
        .method('POST')
        .body(data)
        .send()
    ).body;
  }

  @step('Get event sing id')
  async getEventSignId(eventId: string) {
    return (
      await this.request()
        .url(`/api/events/${eventId}/sign`)
        .send()
    ).body;
  }

  @step('Sign event')
  async signEvent(eventId: string, signId: string) {
    return (
      await this.request()
        .url(`/api/events/${eventId}/sign`)
        .method('POST')
        .body({ signId: signId })
        .send()
    ).body;
  }

  @step('Get event sync tasks')
  async getEventSyncTasks(eventId: string): Promise<any> {
    return (
      await this.request()
        .url(`/api/events/${eventId}/syncTasks`)
        .send()
    ).body;
  }

  @step('Get event sync tasks')
  async getEventById(eventId: string): Promise<any> {
    return (
      await this.request()
        .url(`/api/event/${eventId}`)
        .send()
    ).body;
  }

  @step('Sync event')
  async syncEvent(eventId: string, syncTaskId: string): Promise<any> {
    return (
      await this.request()
        .url(`/api/events/${eventId}/syncTasks/${syncTaskId}/sync`)
        .method('POST')
        .body({})
        .send()
    ).body;
  }
}
