;(function($){
	var Carousel=function(poster){
		var self=this;
		// 保存旋转木马单个对象
		this.poster=poster;
		this.poster_main=poster.find('#poster_main');
		
		this.poster_list=poster.find('.poster-list');	
		this.poster_item=poster.find('.poster-item');
		if(this.poster_item.length%2==0){
			this.poster_list.append(this.poster_item.eq(0).clone());
			this.poster_item=this.poster_list.children();
		}
		this.poster_item_first=poster.find('.poster-item').first();
		this.poster_item_last=poster.find('.poster-item').last();
		this.nextBtn=poster.find('.poster-next-btn');
		this.prevBtn=poster.find('.poster-prev-btn');
		this.routateFlag=true;
		// 配置默认的参数
		this.setting={
			"height":270,
		    "width":800,
			"posterHeight":270,
			"posterWidth":640,
			"scale":0.9,
			"speed":500,
			"deplay":2000,
			"autoplay":"true",
			"verticalAlign":"middle"
		};

		$.extend(this.setting,this.getSetting());
		this.setSettingValue();

		this.setPosterPost();
		this.nextBtn.click(function(){
			if(self.routateFlag){
				self.routateFlag=false;
				self.setRoutate("left");
				
			}
			
		})
		this.prevBtn.click(function(){
			if(self.routateFlag){
				self.routateFlag=false;
				self.setRoutate("right");
				
			}
			
		})
		if(this.setting.autoplay){
			this.autoPlay();
			this.poster.hover(function(){
				window.clearInterval(self.timer);
			},function(){
				self.autoPlay();
		})
		
	}	
	}
	Carousel.prototype={
		// 自动播放
		autoPlay:function(){
			var self=this
			this.timer=window.setInterval(function(){
				self.nextBtn.click();
			},self.setting.deplay)
		},
		// 旋转
		setRoutate:function(dir){
			var _this=this;
			var zIndexArr=[];
			
			if(dir=="left"){
				this.poster_item.each(function(){
					var self=$(this);
					var prev=self.prev().get(0)?self.prev():_this.poster_item_last,
						width=prev.width(),
						height=prev.height(),
						left=prev.css('left'),
						zIndex=prev.css('zIndex'),
						opacity=prev.css('opacity'),
						top=prev.css('top');
						zIndexArr.push(zIndex);

						self.animate({
							width:width,
							height:height,
							left:left,
							opacity:opacity,
							top:top,
							// zIndex:zIndex,
						},_this.setting.speed,function(){
							_this.routateFlag=true;
						})

				})
				this.poster_item.each(function(i){
					$(this).css("zIndex",zIndexArr[i]);
					
				})
			}else if(dir=="right"){
				this.poster_item.each(function(){
					var self=$(this);
					var prev=self.prev().get(0)?self.prev():_this.poster_item_last,
						width=prev.width(),
						height=prev.height(),
						left=prev.css('left'),
						zIndex=prev.css('zIndex'),
						opacity=prev.css('opacity'),
						top=prev.css('top');
						zIndexArr.push(zIndex);

						self.animate({
							width:width,
							height:height,
							left:left,
							opacity:opacity,
							top:top,
							// zIndex:zIndex,
						},_this.setting.speed,function(){
							_this.routateFlag=true;
						})

				})
				this.poster_item.each(function(i){
					$(this).css("zIndex",zIndexArr[i]);
					
				})
			}
		},
		// 设置对其方式
		setVerticalAlgin:function(height){
			var verticalType=this.setting.verticalAlign,
				top=0;
			if(verticalType==="top"){
				top=0;
			}else if(verticalType==="middle"){
				top=(this.setting.height-height)/2
			}else if(verticalType==="bottom"){
				top=this.setting.height-height;
			}else{
				top=(this.setting.height-height)/2
			}

			return top;
		},
		// 设置右边图片的散列排列
		setPosterPost:function(){
			var self=this;
			var sliceitems=this.poster_item.slice(1);
			
			var slicelength=sliceitems.length/2;
			var rightitem=sliceitems.slice(0,slicelength);
			
			var level=Math.floor(this.poster_item.length/2);
			var leftitem = sliceitems.slice(slicelength);

			// 获取每张图片的宽度和高度
			var rw=this.setting.posterWidth;
			var rh=this.setting.posterHeight;
			var gap=((this.setting.width-this.setting.posterWidth)/2)/level;

			// 获取第一张图片的left值和固定值
			var firstLeft=(this.setting.width-this.setting.posterWidth)/2,
				fixOffsetLeft=firstLeft+rw;

			rightitem.each(function(index,item){
				level--;
				rw=rw*self.setting.scale;
				rh=rh*self.setting.scale;
				console.log(rw+"..."+rh);
				var j=index;
				$(this).css({
					width:rw,
					height:rh,
					zIndex:level,
					opacity:1/(++j),
					left:fixOffsetLeft+(++index)*gap-rw,
					top:self.setVerticalAlgin(rh)

				})
			})
			var lw=rightitem.last().width(),
				lh=rightitem.last().height();

			var oloop=Math.floor(self.poster_item.length/2);
			leftitem.each(function(i){				
				$(this).css({
					width:lw,
					height:lh,
					zIndex:i,
					opacity:1/oloop,
					left:i*gap,
					top:self.setVerticalAlgin(lh)
				})
					lw=lw/self.setting.scale,
					lh=lh/self.setting.scale;
				oloop--;
			})
		},
		// 设置配置参数
		setSettingValue:function(){
			this.poster.css({
				width:this.setting.width,
				height:this.setting.height
			});
			this.poster_list.css({
				width:this.setting.width,
				height:this.setting.height
			});
			var w=(this.setting.width-this.setting.posterWidth)/2;
			this.nextBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.poster_item.length/2)
			});

			this.prevBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.poster_item.length/2)
			});
			this.poster_item_first.css({
				width:this.setting.posterWidth,
				height:this.setting.posterHeight,
				left:w,
				zIndex:Math.floor(this.poster_item.length/2)
			})
		},
		// 获取人工配置参数
		getSetting:function(){
			var setting=this.poster.attr('data-setting');
			console.log(setting)
			if(setting&&setting!=""){
				return $.parseJSON(setting);
			}else{
				return {};
			}
		}
		
	}
Carousel.init = function(posters){
		var _this_ = this;
		posters.each(function(){
			new  _this_($(this));
		});
	};
	window['Carousel']=Carousel;
	
})(jQuery);