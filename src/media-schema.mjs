import videoMetadata from './video-metadata.json' with { type: 'json' };
const person={'@type':'Person','@id':'https://davetaxnz.nz/#dave-ananth',name:'Dave Ananth',url:'https://davetaxnz.nz/#about',jobTitle:'Tax Barrister and Partner',worksFor:{'@id':'https://mplaw.nz/#organization'}};
const firm={'@type':'Organization','@id':'https://mplaw.nz/#organization',name:'Meridian Partners',url:'https://mplaw.nz/'};
export function youtubeVideo(id,title,description,url){
 const meta=videoMetadata.find(item=>item.id===id);
 if(!meta?.uploadDate||!meta.thumbnail_url)throw new Error('Verified video metadata missing: '+id);
 return {'@type':'VideoObject','@id':url+'#video-'+id,name:title,description,embedUrl:`https://www.youtube-nocookie.com/embed/${id}`,thumbnailUrl:meta.thumbnail_url,uploadDate:meta.uploadDate,duration:`PT${meta.lengthSeconds}S`,publisher:{'@type':'Organization',name:'Notes From The Executive'},contributor:{'@id':person['@id']},isPartOf:{'@type':'CreativeWork',name:'Notes From The Executive',url:'https://www.youtube.com/watch?v=-l0xlsWFeKw'},mainEntityOfPage:url};
}
export function mediaSchema(article,origin,url){
 const isDave=origin==='https://davetaxnz.nz';
 const publisher={'@type':'Organization',name:isDave?'DaveTaxNZ':'Meridian Partners',url:origin+'/'};
 const description=article.summary||article.excerpt;
 const videos=article.videos ? article.videos.map(v=>youtubeVideo(v.id,v.title,description,url)) : article.videoEmbedUrl?.includes('youtube') ? [youtubeVideo(new URL(article.videoEmbedUrl).pathname.split('/').pop(),article.videoTitle||article.title,description,url)] : [{ '@type':'VideoObject','@id':url+'#three-news',name:article.videoTitle,description,embedUrl:article.videoEmbedUrl,thumbnailUrl:article.videoThumbnail,uploadDate:article.videoUploadDate,publisher:{'@type':'Organization',name:'Three News'},contributor:{'@id':person['@id']},hasPart:{'@type':'Clip',name:'Student-loan reform discussion featuring Dave Ananth',startOffset:43,endOffset:249,url:article.videoEmbedUrl},mainEntityOfPage:url}];
 return [firm,person,{'@type':'Article','@id':url+'#article',headline:article.title,description,datePublished:article.isoDate||article.date,author:publisher,publisher,about:{'@id':person['@id']},mainEntityOfPage:url,video:videos.map(v=>({'@id':v['@id']}))},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},{'@type':'ListItem',position:2,name:'Articles & media',item:origin+(isDave?'/articles-media/':'/articles/')},{'@type':'ListItem',position:3,name:article.title,item:url}]},...videos];
}
export function podcastSchema(origin,url){return [firm,person,{'@type':'WebPage',name:'Articles & media',url,mainEntity:{'@id':url+'#video--l0xlsWFeKw'}},youtubeVideo('-l0xlsWFeKw','Notes From The Executive — Dave Ananth with Mina Amso','Dave Ananth discusses student loans, tax disputes and negotiations with Inland Revenue with host Mina Amso.',url),{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},{'@type':'ListItem',position:2,name:'Articles & media',item:url}]}];}
