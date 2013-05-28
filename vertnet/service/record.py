"""API handlers for VertNet records."""

import webapp2
from vertnet.service.model import RecordIndex, Record, RecordList, RecordPayload
from protorpc import remote
from protorpc.wsgi import service
from google.appengine.datastore.datastore_query import Cursor
import json
from google.appengine.api import taskqueue
import logging
from protorpc.message_types import VoidMessage

def record_list(limit, cursor, q, message=False):
    """Return CommentList or triple (comments, next_cursor, more)."""
    i, n, m, c = RecordIndex.search(q, limit, cursor=cursor, message=message)
    if message:
        if n:
            n = n.urlsafe()
        return RecordList(items=i, cursor=n, more=m, count=c)
    return i, n, m, c


class RecordService(remote.Service):
    """RPC services for working with Records."""

    @remote.method(RecordPayload, RecordPayload)
    def get(self, message):
        """Return a RecordList."""
        record = Record.get_by_id(message.id)
        return RecordPayload(id=message.id, json=record.record)

    @remote.method(RecordList, RecordList)
    def search(self, message):
        """Return a RecordList."""
        curs = None
        if message.cursor:
            curs = Cursor(urlsafe=message.cursor)
        q = json.loads(message.q)
        taskqueue.add(url='/apitracker', params=dict(query=message.q), queue_name="apitracker")
        response = record_list(message.limit, curs, q, message=True)
        return response

    @remote.method(RecordList, RecordList)
    def count(self, message):
        q = json.loads(message.q)
        return RecordList(count=RecordIndex.search(q, None, count=True))

    @remote.method(RecordList, VoidMessage)
    def download(self, message):
        taskqueue.add(url='/backend/download', params=dict(q=message.q, email=message.email), 
            queue_name="download")
        return VoidMessage()

class RecordApi(webapp2.RequestHandler):
    """Record API handler."""

    def post(self):
        self.get()
    
    def get(self):
    	q = json.loads(self.request.get('q'))
        curs = None
        if q.has_key('cursor'):
            curs = Cursor(urlsafe=q['cursor'])
        records, cursor, more = record_list(q['limit'], curs, q)
        if cursor:
            cursor = cursor.urlsafe()
        records = [x.json for x in records]
        result = dict(records=records, cursor=cursor, more=more)
        self.response.headers["Content-Type"] = "application/json"
        self.response.out.write(json.dumps(result))

api = webapp2.WSGIApplication([
    webapp2.Route(r'/service/api/record', handler=RecordApi),],   
    debug=True)
         
rpc = service.service_mappings([('/service/rpc/record', RecordService),],)
