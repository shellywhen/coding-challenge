from app import app

# The port number should be the same as the front end
#try:
app.run(host='localhost', port=12050, use_reloader=False, debug=True)
#except:
    #print("Something wrong!")
