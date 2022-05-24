let eventMixin = {
    /**
     * Subscribe to event, usage:
     *  menu.on('select', function(item) { ... }
    */
    on(eventName, handler) {
      if (!this._eventHandlers) this._eventHandlers = {};
      if (!this._eventHandlers[eventName]) {
        this._eventHandlers[eventName] = [];
      }
      this._eventHandlers[eventName].push(handler);
    },
  
    /**
     * Cancel the subscription, usage:
     *  menu.off('select', handler)
     */
    off(eventName, handler) {
      let handlers = this._eventHandlers?.[eventName];
      if (!handlers) return;
      for (let i = 0; i < handlers.length; i++) {
        if (handlers[i] === handler) {
          handlers.splice(i--, 1);
        }
      }
    },
  
    /**
     * Generate an event with the given name and data
     *  this.trigger('select', data1, data2);
     */
    trigger(eventName, ...args) {
      if (!this._eventHandlers?.[eventName]) {
        return; // no handlers for that event name
      }
  
      // call the handlers
      this._eventHandlers[eventName].forEach(handler => handler.apply(this, args));
    }
  };

  let myObj={
      hello:function()
      {
          console.log("Hello")
      }
  }

  // Make a class
class Menu {
    choose(value) {
      this.trigger("select", value);
    }
  }
  // Add the mixin with event-related methods
  Object.assign(Menu.prototype, eventMixin,myObj);
  
  let menu = new Menu();
  
  // add a handler, to be called on selection:
  menu.on("select", value => console.log(`Value selected: ${value}`));
  menu.on("select", value => console.log(`Value selected: ${value}`));
