# -*- coding: utf-8 -*-
#	
#	2013/04/03
#	
#	JimaLog
#	
import webapp2
import json

class JSONHandler(webapp2.RequestHandler):
	def post(self):
		# 面倒臭いし全部
		
		pass
	
	
	
	def outJSON(self, data):
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write( json.dumps(data) )
