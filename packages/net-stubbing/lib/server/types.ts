import { IncomingMessage } from 'http'
import { Readable } from 'stream'
import {
  CypressIncomingRequest,
  CypressOutgoingResponse,
} from '@packages/proxy'
import {
  RouteMatcherOptions,
  BackendStaticResponse,
} from '../types'

export type GetFixtureFn = (path: string, opts?: { encoding?: string }) => Promise<any>

export interface BackendRoute {
  routeMatcher: RouteMatcherOptions
  handlerId?: string
  hasInterceptor: boolean
  staticResponse?: BackendStaticResponse
  getFixture: GetFixtureFn
}

export interface BackendRequest {
  requestId: string
  /**
   * The route that matched this request.
   */
  route: BackendRoute
  /**
   * A callback that can be used to make the request go outbound.
   */
  continueRequest: Function
  /**
   * A callback that can be used to send the response through the proxy.
   */
  continueResponse?: (newResStream?: Readable) => void
  onResponse?: (incomingRes: IncomingMessage, resStream: Readable) => void
  req: CypressIncomingRequest
  res: CypressOutgoingResponse
  incomingRes?: IncomingMessage
  /**
   * Should the response go to the driver, or should it be allowed to continue?
   */
  sendResponseToDriver?: boolean
}

export interface NetStubbingState {
  // map of request IDs to requests in flight
  requests: {
    [requestId: string]: BackendRequest
  }
  routes: BackendRoute[]
  reset: () => void
}
