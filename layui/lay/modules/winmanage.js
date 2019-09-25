layui.define(['jquery'], function(exports){

		var $ = layui.$

	  	var defaults = {
	  		size: [750, 600]
	  	}

	  	var localConfig = {
	  		get: function(name){

	  			return JSON.parse(localStorage.getItem('app_'+name))

	  		},
	  		set: function(name, layero){

	  			localStorage.setItem('app_'+ name, JSON.stringify({
	  				top: layero.css('top'),
	  				left: layero.css('left'),
	  				width: layero.css('width'),
	  				height: layero.css('height')
	  			}))

	  		}
	  	}

	 	function WinManage(options){
	 		this.list = []
	 		this.active = null;
	 		this.$dock = $(options.dock)

	 		this.bind()
	 	}

	 	WinManage.prototype.bind = function(){

	 		var _this = this

	 		this.$dock
	 			.on('click', '[data-dock-btn]', function(){
	 				_this.select( $(this).data() )
	 			})

	 	}

	 	WinManage.prototype.insert = function(obj){

	 		if( !this.list.some(function(item){ return item.name == obj.name }) ){

	 			var index = this._createWin(obj)

	 			this.list.push( $.extend(obj, { index: index })) 
	 			this._creatDockItem(obj)
	 			this._active( obj.name )

	 		}else{

	 			this.select( obj )
	 		}
	 	}

	 	WinManage.prototype._createWin = function(options){

	 		var _this = this;
	 		var localOptions = localConfig.get(options.name)

	 		var index = layer.open({
			  	type: 2,
			  	title: options.title,
			  	skin: 'windows-layer',
			  	area: localOptions ? [ localOptions.width, localOptions.height ] : [defaults.size[0]+'px', defaults.size[1]+'px'],
			  	offset: localOptions ? [ localOptions.top, localOptions.left ] : [
			  		(window.innerHeight - defaults.size[1])/2 + (_this.list.length)*40,
			  		(window.innerWidth - defaults.size[0])/2 + (_this.list.length)*40				  		
			  	],
			  	shade: 0,
			  	maxmin: true,
			  	resize: true,
			  	content: options.url,			  
			  	zIndex: layer.zIndex, 
			  	resizing: function(layero){
			  		localConfig.set(options.name, layero )
			  	},
			  	moveEnd: function(layero){
			  		localConfig.set(options.name, layero )
			  	},
			  	success: function(layero, i){

				    layer.setTop(layero); 
			    	layero			    		
				    	.find('.layui-layer-title')
				    	.on('mousedown', function(){
				    		_this.focus.call(_this, options)
				    	})

				    layero.find('.layui-layer-min')
				    	.off('click')
				    	.on('click', function(){
				    		_this.hide.call( _this, i)
				    		return false
				    	})
				},
			  	cancel : function(){
			  		
			  	},
			  	end: function(){
			  		 _this.remove(index)
			  	}
			})

			return index

		}

	 	WinManage.prototype._creatDockItem = function(options){

	 		this.$dock.append(
	 			`<li>
	 				<button class="layui-btn layui-btn-primary layui-btn-sm" data-dock-btn 
	 					data-name="${options.name}" data-index="${options.index}">${options.title}
	 				</button>
	 			</li>`
	 		)

	 	}

	 	WinManage.prototype._active = function(name){

	 		this.$dock.find('[data-dock-btn]')
	 			.removeClass('active')
	 			.filter('[data-name='+ name +']')
	 			.addClass('active')

	 	}

	 	WinManage.prototype._unActive = function(index){

	 		this.$dock
	 			.find('[data-index='+ index +']')
	 			.removeClass('active')

	 	}

	 	WinManage.prototype.select = function(obj){
	 		
	 		this.show( obj.index )
	 		$('#layui-layer' + obj.index + ' .layui-layer-title')
	 			.trigger('mousedown')
	 			.trigger('mouseup')	  	 		

	 	}

	 	WinManage.prototype.remove = function(index){

	 		var target = this.list.find(function(item){ return item.index == index })
	 		var point = this.list.indexOf(target)

	 		console.log( point )
	 		
	 		this.$dock.find('[data-name="'+ target.name +'"]').parent().remove()

	 		this.list.splice( point, 1 ) 

	 	}

	 	WinManage.prototype.focus = function(option){

	 		this._active( option.name )

	 	}

	 	WinManage.prototype.hide = function(index){

	 		$('#layui-layer' + index ).hide()
	 		this._unActive(index)

	 	}

	 	WinManage.prototype.show = function(index){

	 		$('#layui-layer' + index ).show()

	 	}


	  	exports('winmanage', WinManage);

})	