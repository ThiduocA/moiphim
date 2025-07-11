using moiphim.DataAccess.Entities;
using Newtonsoft.Json;

namespace moiphim.Services.Models.ResponseModels.Movies;

public class ApiResponseModel
{
    [JsonProperty("status")]
    public bool Status { get; set; }

    [JsonProperty("msg")]
    public string Msg { get; set; }

    [JsonProperty("movie")]
    public MovieItemModel Movie { get; set; }

    [JsonProperty("episodes")]
    public List<EpisodeServerModel> Episodes { get; set; }

}
public class MovieItemModel
{
    [JsonProperty("_id")]
    public string _id { get; set; }

    [JsonProperty("name")]
    public string name { get; set; }

    [JsonProperty("slug")]
    public string slug { get; set; }

    [JsonProperty("origin_name")]
    public string origin_name { get; set; }

    [JsonProperty("content")]
    public string content { get; set; }

    [JsonProperty("type")]
    public string type { get; set; }

    [JsonProperty("status")]
    public string status { get; set; }

    [JsonProperty("poster_url")]
    public string poster_url { get; set; }

    [JsonProperty("thumb_url")]
    public string thumb_url { get; set; }

    [JsonProperty("is_copyright")]
    public bool is_copyright { get; set; }

    [JsonProperty("sub_docquyen")]
    public bool sub_docquyen { get; set; }

    [JsonProperty("chieurap")]
    public bool chieurap { get; set; }

    [JsonProperty("trailer_url")]
    public string trailer_url { get; set; }

    [JsonProperty("time")]
    public string time { get; set; }

    [JsonProperty("episode_current")]
    public string episode_current { get; set; }

    [JsonProperty("episode_total")]
    public string episode_total { get; set; }

    [JsonProperty("quality")]
    public string quality { get; set; }

    [JsonProperty("lang")]
    public string lang { get; set; }

    [JsonProperty("notify")]
    public string notify { get; set; }

    [JsonProperty("showtimes")]
    public string showtimes { get; set; }

    [JsonProperty("year")]
    public int year { get; set; }

    [JsonProperty("view")]
    public int view { get; set; }

    [JsonProperty("actor")]
    public List<string> actor { get; set; }

    [JsonProperty("director")]
    public List<string> director { get; set; }

    [JsonProperty("category")]
    public List<CategoryModel> category { get; set; }

    [JsonProperty("country")]
    public List<CountryModel> country { get; set; }

    [JsonProperty("tmdb")]
    public TmdbModel tmdb { get; set; }

    [JsonProperty("imdb")]
    public ImdbModel imdb { get; set; }

    [JsonProperty("created")]
    public TimeModel created { get; set; }

    [JsonProperty("modified")]
    public TimeModel modified { get; set; }
}

public class EpisodeServerModel
{
    [JsonProperty("server_name")]
    public string server_name { get; set; }

    [JsonProperty("server_data")]
    public List<EpisodeDataModel> server_data { get; set; }
}

public class EpisodeDataModel
{
    [JsonProperty("name")]
    public string name { get; set; }

    [JsonProperty("slug")]
    public string slug { get; set; }

    [JsonProperty("filename")]
    public string filename { get; set; }

    [JsonProperty("link_embed")]
    public string link_embed { get; set; }

    [JsonProperty("link_m3u8")]
    public string link_m3u8 { get; set; }
}

public class CategoryModel
{
    [JsonProperty("id")]
    public string id { get; set; }

    [JsonProperty("name")]
    public string name { get; set; }

    [JsonProperty("slug")]
    public string slug { get; set; }
}

public class CountryModel
{
    [JsonProperty("id")]
    public string id { get; set; }

    [JsonProperty("name")]
    public string name { get; set; }

    [JsonProperty("slug")]
    public string slug { get; set; }
}

public class TmdbModel
{
    [JsonProperty("type")]
    public string type { get; set; }

    [JsonProperty("id")]
    public string id { get; set; }

    [JsonProperty("season")]
    public int? season { get; set; }

    [JsonProperty("vote_average")]
    public double vote_average { get; set; }

    [JsonProperty("vote_count")]
    public int vote_count { get; set; }
}

public class ImdbModel
{
    [JsonProperty("id")]
    public string id { get; set; }
}

public class TimeModel
{
    [JsonProperty("time")]
    public string time { get; set; }
}
